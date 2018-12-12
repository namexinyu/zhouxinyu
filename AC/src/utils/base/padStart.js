export default function (num, len = 2, ch = '0') {
  let output = `${num}`;

  while (output.length < len) {
    output = `${ch}${output}`;
  }
  return output;
}
