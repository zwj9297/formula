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

describe('复杂运算', function () {
  const formula = new Formula();
  it('(1+(2-3)*4)/5=-0.6?', function () {
    return formula.calculate('(1+(2-3)*4)/5').then((res) => {
      expect(res).to.be.equal(-0.6);
    });
  });
});

describe('数学函数', function () {
  const formula = new Formula({ plugins: [Arithmetic] });
  it('$add(1,1)=2?', function () {
    return formula.calculate('$add(1,1)').then((res) => {
      expect(res).to.be.equal(2);
    });
  });
});
