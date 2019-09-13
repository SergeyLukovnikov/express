export function timeout<T>(time: number): (data: any) => Promise<T> {
  return (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), time);
    });
  };
}
