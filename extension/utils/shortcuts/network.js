export const ft = fetch;
export const fd = FormData;
export const hd = Headers;
export const rq = Request;
export const rs = Response;
export const jf = async (u, o) => (await fetch(u, o)).json();
export const tf = async (u, o) => (await fetch(u, o)).text();
