
const markright = require('./index.js')

const tests = [
  {
    input: '@a@b@c',
    output: `[{"id":"a"},{"id":"b"},{"id":"c"}]`
  },
  {
    input: '@a@@@b',
    output: `[{"id":"a"},"@",{"id":"b"}]`
  },
  {
    input: `abc@d efg`,
    output: `["abc",{"id":"d"}," efg"]`
  },
  {
    input: `abc@d{}efg`,
    output: `["abc",{"id":"d"},"efg"]`
  },
  {
    input: 'abc@d{efg}hij',
    output: `["abc",{"id":"d","text":["efg"]},"hij"]`
  },
  {
    input: 'abc@x(y,z){efg}hij',
    output: `["abc",{"id":"x","args":["y","z"],"text":["efg"]},"hij"]`
  },
  {
    input: 'abc\n\ndef',
    output: '["abc",null,"def"]'
  },
  {
    input: 'abc\n\n\ndef',
    output: '["abc",null,null,"def"]'
  },
  {
    input: 'abc\n\n\n\ndef',
    output: '["abc",null,null,null,"def"]'
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
    input: 'a a a a \nb\n\nd\ne@xxx(1, 2, 3){a\n\nb}\n',
    output: `["a a a a ","b",null,"d","e",{"id":"xxx","args":["1","2","3"],"text":["a",null,"b"]}]`
  },
  {
    input: '@code{int @main()<<< int a = 1; >>>}',
    output: '[{"id":"code","text":["int ",{"id":"main","text":[" int a = 1; "]}]}]'
  },
  {
    input: '@code<<<int main() { int a = 1; }>>>',
    output: '[{"id":"code","text":["int main() { int a = 1; }"]}]'
  },
  {
    input: '@code<<<@@include <iostream>;\nusing namespace std;\n\nint main() { cout << "hi"; }>>>',
    output: '[{"id":"code","text":["@include <iostream>;","using namespace std;",null,"int main() { cout << \\"hi\\"; }"]}]'
  },
  {
    input: 'abc\n@d{e}\n',
    output: '["abc ",{"id":"d","text":["e"]}]'
  },
  {
    input: 'abc\n\n@d{e}\n',
    output: '["abc",null,{"id":"d","text":["e"]}]'
  },
  {
    input: 'abc @d{e}\nfgh',
    output: '["abc ",{"id":"d","text":["e"]}," fgh"]'
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