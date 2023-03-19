export default async function wrapPromise(promise: Promise<any>, client: any) {
  let status = 'pending';
  let result: any;
  // await client?.terminal.log('Loading...');

  const suspender = promise.then(
    async (r) => {
      // await client?.terminal.log('Success!');
      status = 'success';
      result = r;
    },
    async (e) => {
      await client?.terminal.log({ type: 'error', value: e?.message?.toString() });
      status = 'error';
      result = e;
    },
  );
  
  return result;
}
