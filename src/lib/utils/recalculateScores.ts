export const recalculateScores = async (prisma, group_id) => {
	try {
	  const group = await prisma.users.findMany({
		where: {
		  peer_review_assignments: {
			some: {
			  group_id: group_id,
			},
		  },
		},
	  });
  
	  const submissions = await Promise.all(
		group.map(async (student) => {
		  const submission = await prisma.peer_review_submissions.findFirst({
			where: {
			  student_id: student.id,
			  peer_review_group_id: group_id,
			},
			orderBy: {
			  created_at: 'desc',
			},
			include: {
			  peer_review_responses: true,
			},
		  });
  
		  return submission;
		})
	  );
  
	  let allCompleted = false;
  
	  allCompleted = submissions.every((submission) => submission !== null);
  
	  if (allCompleted) {
		group.map(async (student) => {
		  const allScores = [];
		  let omittedCount = 0;
		  
		  await Promise.all(
			submissions.map(async (sb) => {
			  if (sb.omit) {
				omittedCount++;
			  } else {
				const scores = await prisma.peer_review_scores.findMany({
				  where: {
					studentId: student.id,
					submission_id: sb?.id,
				  },
				});
  
				scores.map((score) => allScores.push(score));
			  }
			})
		  );
  
		  const scores = allScores.filter((score) => score.studentId === student.id);
  
		  let average;
		  if (scores.length === 0) {
			average = 0;
		  } else {
			average = scores.reduce((acc, score) => acc + score.score, 0) / (submissions.length - omittedCount);
		  }
  
		  console.log(average);
  
		  const sub = submissions.filter((sbs) => sbs?.student_id === student.id)[0];
  
		  await prisma.peer_review_submissions.update({
			where: {
			  id: sub?.id,
			},
			data: {
			  score: sub.omit ? 0 : average,
			},
		  });
  
		  await prisma.peer_review_assignments.updateMany({
			where: {
			  student_id: student.id,
			  peer_review_id: sub?.peer_review_id as number,
			},
			data: {
			  final_score: sub.omit ? 0 : average,
			},
		  });
		});
	  }
	} catch (e) {
	  console.log(e);
	}
  
	return true;
  };
  