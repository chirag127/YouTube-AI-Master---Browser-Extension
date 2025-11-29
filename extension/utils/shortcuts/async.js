export const pr = Promise.resolve.bind(Promise);
export const pj = Promise.reject.bind(Promise);
export const pa = Promise.all.bind(Promise);
export const pc = Promise.race.bind(Promise);
export const np = f => new Promise(f);
export const pt = (p, t) => new Promise((r, j) => { setTimeout(() => j(new Error('TO')), t); p.then(r).catch(j); });
