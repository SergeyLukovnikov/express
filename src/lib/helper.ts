export function timeout<T>(time: number): (data: any) => Promise<T> {
  return (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), time);
    });
  };
}

// async function asyncForEach(array: any[], callback: (item: any, index: any, c: any[]) => any) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// }
