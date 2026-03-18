export async function delay(ms = 250) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}
