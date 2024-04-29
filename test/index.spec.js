const { Formula, Arithmetic } = require('../dist/formula');

var expect = require('chai').expect;

describe('简单运算', function () {
  const formula = new Formula();
  it('相加：1+1=2?', function () {
    return formula.calculate('1+1').then((res) => {
      expect(res).to.be.equal(2);
    });
  });
  it('小数相加：0.1+0.2=0.3?', function () {
    return formula.calculate('0.1+0.2').then((res) => {
      expect(res).to.be.equal(0.3);
    });
  });
  it('相减：1-2=-1?', function () {
    return formula.calculate('1-2').then((res) => {
      expect(res).to.be.equal(-1);
    });
  });
  it('小数相减：0.1-0.2=0.1?', function () {
    return formula.calculate('0.1-0.2').then((res) => {
      expect(res).to.be.equal(-0.1);
    });
  });
  it('相乘：1*2=2?', function () {
    return formula.calculate('1*2').then((res) => {
      expect(res).to.be.equal(2);
    });
  });
  it('小数相乘：0.1*0.2=0.02?', function () {
    return formula.calculate('0.1*0.2').then((res) => {
      expect(res).to.be.equal(0.02);
    });
  });
  it('相除：1/2=0.5?', function () {
    return formula.calculate('1/2').then((res) => {
      expect(res).to.be.equal(0.5);
    });
  });
  it('小数相除：0.1/0.2=0.5?', function () {
    return formula.calculate('0.1/0.2').then((res) => {
      expect(res).to.be.equal(0.5);
    });
  });
});

describe('组合运算', function () {
  const formula = new Formula();
  it('(1+(2-3)*4)/5=-0.6?', function () {
    return formula.calculate('(1+(2-3)*4)/5').then((res) => {
      expect(res).to.be.equal(-0.6);
    });
  });
});

describe('数学函数', function () {
  const formula = new Formula({ plugins: [Arithmetic] });
  it('求和：$add(1,1)=2?', function () {
    return formula.calculate('$add(1,1)').then((res) => {
      expect(res).to.be.equal(2);
    });
  });
  it('求差：$minus(4,1)=3?', function () {
    return formula.calculate('$minus(4,1)').then((res) => {
      expect(res).to.be.equal(3);
    });
  });
  it('求积：$multi(3,3)=9?', function () {
    return formula.calculate('$multi(3,3)').then((res) => {
      expect(res).to.be.equal(9);
    });
  });
  it('求商：$div(8,5)=1.6?', function () {
    return formula.calculate('$div(8,5)').then((res) => {
      expect(res).to.be.equal(1.6);
    });
  });
  it('求幂：$pow(2,8)=256?', function () {
    return formula.calculate('$pow(2,8)').then((res) => {
      expect(res).to.be.equal(256);
    });
  });
  it('组合运算：$add($div(8,5), $multi(2,2))=5.6?', function () {
    return formula.calculate('$add($div(8,5), $multi(2,2))').then((res) => {
      expect(res).to.be.equal(5.6);
    });
  });
  it('大于等于：$gte(1,2)=false?', function () {
    return formula.calculate('$gte(1,2)').then((res) => {
      expect(res).to.be.equal(false);
    });
  });
  it('大于：$gt(2,1)=true?', function () {
    return formula.calculate('$gt(2,1)').then((res) => {
      expect(res).to.be.equal(true);
    });
  });
  it('小于等于：$lte(3,3)=true?', function () {
    return formula.calculate('$lte(3,3)').then((res) => {
      expect(res).to.be.equal(true);
    });
  });
  it('等于：$lt(3,3)=false?', function () {
    return formula.calculate('$lt(3,3)').then((res) => {
      expect(res).to.be.equal(false);
    });
  });
  it('相等：$eq(1,1)=true?', function () {
    return formula.calculate('$eq(1,1)').then((res) => {
      expect(res).to.be.equal(true);
    });
  });
  it('不相等：$neq(1,2)=true?', function () {
    return formula.calculate('$neq(1,2)').then((res) => {
      expect(res).to.be.equal(true);
    });
  });
  it('转数字：$number("123")=123?', function () {
    return formula.calculate('$number("123")').then((res) => {
      expect(res).to.be.equal(123);
    });
  });
  it('转数字：$number("1.23e2")=123?', function () {
    return formula.calculate('$number("1.23e2")').then((res) => {
      expect(res).to.be.equal(123);
    });
  });
});
