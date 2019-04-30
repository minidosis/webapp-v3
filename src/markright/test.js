
const markright = require('./index.js')

const tests = [
  {
    input: '#a#b#c',
    output: `[{"cmd":"a"},{"cmd":"b"},{"cmd":"c"}]`
  },
  {
    input: `abc#d efg`,
    output: `["abc",{"cmd":"d"}," efg"]`
  },
  {
    input: `abc#d{}efg`,
    output: `["abc",{"cmd":"d"},"efg"]`
  },
  {
    input: 'abc#d{efg}hij',
    output: `["abc",{"cmd":"d","text":["efg"]},"hij"]`
  },
  {
    input: 'abc#x(y,z){efg}hij',
    output: `["abc",{"cmd":"x","args":["y","z"],"text":["efg"]},"hij"]`
  },
  {
    input: 'abc\n\ndef',
    output: '["abc",null,"def"]'
  },
  {
    input: 'abc\n    \ndef',
    output: '["abc",null,"def"]'
  },
  {
    input: 'abc\n    \ndef\n    \nghi',
    output: '["abc",null,"def",null,"ghi"]'
  },
  {
    input: 'a a a a \nb\n\nd\ne#xxx(1, 2, 3){a\n\nb}\n',
    output: `["a a a a ","b",null,"d","e",{"cmd":"xxx","args":["1","2","3"],"text":["a",null,"b"]}]`
  },
  {
    input: '#code{int #main()[ int a = 1; ]}',
    output: '[{"cmd":"code","text":["int ",{"cmd":"main"},"[ int a = 1; ]"]}]'
  } 
]

for (let test of tests) {
  if (test.output) {
    const output = markright.parse(test.input)
    if (JSON.stringify(output) !== test.output) {
      console.log("Input  ", JSON.stringify(test.input))
      console.log("Should ", test.output)
      console.log("Is     ", JSON.stringify(output))
      console.log()
    }
  }
}