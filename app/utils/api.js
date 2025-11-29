export async function apiGET(url, token) {
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || "Erro API");
  return res.json();
}