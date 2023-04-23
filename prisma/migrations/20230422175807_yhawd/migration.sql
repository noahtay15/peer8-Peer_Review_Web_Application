-- DropForeignKey
ALTER TABLE "class_students" DROP CONSTRAINT "fk_class_id";

-- DropForeignKey
ALTER TABLE "class_students" DROP CONSTRAINT "fk_student_id";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "fk_instructor_id";

-- DropForeignKey
ALTER TABLE "peer_review_assignments" DROP CONSTRAINT "fk_group_id";

-- DropForeignKey
ALTER TABLE "peer_review_assignments" DROP CONSTRAINT "fk_peer_review_id";

-- DropForeignKey
ALTER TABLE "peer_review_assignments" DROP CONSTRAINT "fk_student_id_2";

-- DropForeignKey
ALTER TABLE "peer_review_groups" DROP CONSTRAINT "fk_peer_review_id_2";

-- DropForeignKey
ALTER TABLE "peer_review_responses" DROP CONSTRAINT "fk_peer_review_submission_id";

-- DropForeignKey
ALTER TABLE "peer_review_scores" DROP CONSTRAINT "fk_submission_id";

-- DropForeignKey
ALTER TABLE "peer_review_submissions" DROP CONSTRAINT "fk_peer_review_assignment_id_2";

-- DropForeignKey
ALTER TABLE "peer_review_submissions" DROP CONSTRAINT "fk_peer_review_group_id";

-- DropForeignKey
ALTER TABLE "peer_review_submissions" DROP CONSTRAINT "fk_peer_review_id_3";

-- DropForeignKey
ALTER TABLE "peer_review_submissions" DROP CONSTRAINT "fk_student_id_3";

-- DropForeignKey
ALTER TABLE "peer_reviews" DROP CONSTRAINT "fk_class_id_2";

-- DropForeignKey
ALTER TABLE "peer_reviews" DROP CONSTRAINT "fk_template_id_2";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "fk_template_id";

-- DropForeignKey
ALTER TABLE "templates" DROP CONSTRAINT "fk_creator_id";

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "fk_instructor_id" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_students" ADD CONSTRAINT "fk_class_id" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_students" ADD CONSTRAINT "fk_student_id" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "fk_creator_id" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "fk_template_id" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "fk_template_id_2" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "fk_class_id_2" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_assignments" ADD CONSTRAINT "fk_peer_review_id" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_assignments" ADD CONSTRAINT "fk_student_id_2" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_assignments" ADD CONSTRAINT "fk_group_id" FOREIGN KEY ("group_id") REFERENCES "peer_review_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_responses" ADD CONSTRAINT "fk_peer_review_submission_id" FOREIGN KEY ("peer_review_submission_id") REFERENCES "peer_review_submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_groups" ADD CONSTRAINT "fk_peer_review_id_2" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_group_id" FOREIGN KEY ("peer_review_group_id") REFERENCES "peer_review_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_id_3" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_assignment_id_2" FOREIGN KEY ("peer_review_assignment_id") REFERENCES "peer_review_assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_student_id_3" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_scores" ADD CONSTRAINT "fk_submission_id" FOREIGN KEY ("submission_id") REFERENCES "peer_review_submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
