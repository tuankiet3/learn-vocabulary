var minimumSumSubarray = function (nums, l, r) {
  let n = nums.length;
  let minSum = Infinity;
  let j = l;
  while (j <= r) {
    for (let i = 0; i < n - j + 1; i++) {
      let temp = nums.slice(i, i + j);
      let tempSum = temp.reduce((total, current) => {
        return total + current;
      }, 0);
      if (tempSum < minSum && tempSum > 0) {
        minSum = tempSum;
      }
    }
    j++;
  }
  return minSum === Infinity ? -1 : minSum;
};

let nums = [5, 8, -6],
  l = 1,
  r = 3;
console.log(minimumSumSubarray(nums, l, r)); // Expected output: 1
