import type { APIResponse } from "$lib/types/Generic";

export interface ExtendedAPIResponse extends APIResponse {
    status: number;
}

export const resendConfirmationCode = async (email: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/verify?email=${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
};

export const confirmEmail = async (email: string, code: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            code,
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const login = async (email: string, password: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const signup = async (email: string, password: string, name: string, type: string, class_code: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            name,
            class_code,
            type,
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}
export const refreshUser = async (token: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            "":""
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getUser = async (token: string, id_token: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            AuthorizationId: `Bearer ${id_token}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}


export const getClasses = async (token: string, id_token: string, page = 0): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/classes?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            AuthorizationId: `Bearer ${id_token}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getTemplates = async (token: string, id_token: string, page = 0): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/templates?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            AuthorizationId: `Bearer ${id_token}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const createTemplate = async (token: string, id_token: string, data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/templates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            AuthorizationId: `Bearer ${id_token}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}