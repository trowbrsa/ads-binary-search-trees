const { performance } = require('perf_hooks');

const size = 2000000;
const split_count = 1000;
const split_size = size / split_count;
console.log(`Running tests, paramaters...`);
console.log(`Size: ${size}`);
console.log(`split_count: ${split_count}`);
console.log(`split_size: ${split_size}`);

const outlier_threshold = 1;

const round = (num, places = 4) => {
  return Math.round((num + Number.EPSILON) * (10 * places)) / (10 * places);
}

const data = [];

// const times = new Array(size);
const splits = [];

let split_t0 = performance.now();
let run_t0 = performance.now();

for (let i = 0; i < size; i++) {
  // const t0 = performance.now();
  data.push(i * i);
  // times.push(performance.now() - t0);
  if (i % split_size === split_size - 1) {
    splits.push(performance.now() - split_t0);
    split_t0 = performance.now();
  }
}

const run_time = performance.now() - run_t0;

console.log(`finished run, total time: ${run_time}, splits:`);
// console.log(JSON.stringify(splits));

let power_of_two = 2;

const split_times = [];
const record_split = (time, pots) => {
  if (!split_times[pots]) {
    split_times[pots] = [];
  }

  split_times[pots].push(time);
}

splits.forEach((split, i) => {
  // console.log("");
  // console.log(`Split ${i}: ${split} ms`);

  const slice_start = split_size * i;
  const slice_end = split_size * (i + 1);
  // console.log(`Range: ${slice_start} to ${slice_end}`);

  // const slice = times.slice(slice_start, slice_end);

  const pot_list = [];
  while (power_of_two < slice_end) {
    pot_list.push(power_of_two);
    power_of_two *= 2;
  }

  // console.log(`${pot_list.length} powers of two in this slice: ${pot_list.join(', ')}`);

  record_split(split, pot_list.length);

  // const avg_time = slice.reduce((memo, current) => memo + current, 0) / slice.length;
  // console.log(`Avg insert time: ${avg_time} ms`);

  // let outlier_count = 0;
  // slice.forEach((time, j) => {
  //   if (time > avg_time * outlier_threshold) {
  //     outlier_count += 1;
  //     const index = split_size * i + j;
  //     console.log(`  push ${index} took ${time} ms (${time / avg_time * 100}% of avg)`);
  //   }
  // });
  // console.log(`Total ${outlier_count} outliers`);

});

console.log('splits by pots');
split_times.forEach((splits, pots) => {
  if (splits) {
    const average = splits.reduce((memo, current) => memo + current, 0) / splits.length;
    console.log(`${pots}: ${average} (average of ${splits.length})`);
  }
});

