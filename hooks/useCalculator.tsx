import { useEffect, useRef, useState } from "react";

enum Operator {
  add = "+",
  subtract = "-",
  multiply = "x",
  divide = "÷",
}

export const useCalculator = () => {
  const [formula, setFormula] = useState("0");

  const [number, setNumber] = useState("0");
  const [prevNumber, setPrevNumber] = useState("0");

  const lastOperation = useRef<Operator>();

  useEffect(() => {
    if (lastOperation.current) {
      const firstFormulaPart = formula.split(" ").at(0);
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
    } else {
      setFormula(number);
    }
  }, [number]);

  useEffect(() => {
    // todo: calcular el resultado
    const subResult = calculateSubResult();
    setPrevNumber(subResult.toString());
  }, [formula]);

  const clean = () => {
    setNumber("0");
    setPrevNumber("0");
    setFormula("0");
    lastOperation.current = undefined;
  };

  const togglePositiveNegative = () => {
    if (number.includes("-")) {
      setNumber(number.replace("-", ""));
    } else {
      setNumber("-" + number);
    }
  };

  const deleteLastCharacter = () => {
    if (number.length === 1) {
      setNumber("0");
    } else {
      setNumber(number.slice(0, -1));
    }
  };

  const setLastNumber = () => {
    calculateResult();

    // guardar el numero actual en prevNumber y resetear number
    if (number.endsWith(".")) {
      setPrevNumber(number.slice(0, -1));
    }

    setPrevNumber(number);
    setNumber("0");
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const subtractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtract;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  };

  const calculateSubResult = () => {
    const [firstValue, operator, secondValue] = formula.split(" ");
    const firstNumber = Number(firstValue);
    const secondNumber = Number(secondValue); // NaN si no hay segundo valor

    if (isNaN(secondNumber)) return firstNumber; // si no hay segundo valor, retornar el primer valor

    switch (operator) {
      case Operator.add:
        return firstNumber + secondNumber;
      case Operator.subtract:
        return firstNumber - secondNumber;
      case Operator.multiply:
        return firstNumber * secondNumber;
      case Operator.divide:
        return firstNumber / secondNumber;
      default:
        throw new Error(`Operator ${operator} is not supported`);
    }
  };

  const calculateResult = () => {
    const subResult = calculateSubResult();
    setFormula(subResult.toString());
    lastOperation.current = undefined;
    setPrevNumber("0");
  };

  const buildNumber = (numberString: string) => {
    // verificar si ya existe el punto decimal
    if (number.includes(".") && numberString === ".") return;

    if (number.startsWith("0") || number.startsWith("-0")) {
      if (numberString === ".") {
        return setNumber(number + numberString);
      }

      if (numberString === "0" && number.includes(".")) {
        return setNumber(number + numberString);
      }

      if (numberString !== "0" && !number.includes(".")) {
        return setNumber(numberString);
      }

      if (numberString === "0" && !number.includes(".")) {
        return;
      }
    }

    setNumber(number + numberString);
  };

  return {
    // Props
    formula,
    number,
    prevNumber,

    // methods
    buildNumber,
    clean,
    togglePositiveNegative,
    deleteLastCharacter,
    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    calculateSubResult,
    calculateResult,
  };
};
