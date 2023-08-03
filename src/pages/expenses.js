import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { BsTrash } from "react-icons/bs";

export default function Expenses() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [expensesList, setExpensesList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    // 1. get the incomes from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses"));
    // 2. check if there is a data in local storage or not
    if (expenses) {
      setExpensesList(expenses);
    }
  }, []);

  const addExpenses = () => {
    // 1. clone the list
    const newexpensesList = [...expensesList];

    // 2. make sure name & amount is not empty
    if (name && amount) {
      // 3. push new income
      newexpensesList.push({
        id: nanoid(),
        name: name,
        amount: parseInt(amount),
      });

      // 4. save into the local storage & set the new state for incomeList
      setExpensesList(newexpensesList);
      localStorage.setItem("expenses", JSON.stringify(newexpensesList));

      // 5. clear the fields
      setName("");
      setAmount(0);
    } else {
      alert("Please insert your expenses");
    }
  };

  const deleteExpenses = (id) => {
    // 1. filter the list
    const newexpensesList = expensesList.filter((e) => e.id !== id);
    // 2. update to local storage and set new state
    setExpensesList(newexpensesList);
    localStorage.setItem("expenses", JSON.stringify(newexpensesList));
  };

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      // 1. clone the existing checked list
      const newCheckedList = [];
      expensesList.forEach((e) => {
        newCheckedList.push(e.id);
      });
      setCheckedList(newCheckedList);
    } else {
      setCheckedList([]);
    }
  };

  const checkboxOne = (event, id) => {
    // if is checked
    if (event.target.checked) {
      // 1. clone existing checked list
      const newCheckedList = [...checkedList];
      // 2. push new id into the checked list
      newCheckedList.push(id);
      // 3. update the state
      setCheckedList(newCheckedList);
    } else {
      // 1. remove the id from the checked list
      const newCheckedList = checkedList.filter((i) => i !== id);
      // 2. update the state
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    // 1. filter the list
    const newexpensesList = expensesList.filter((e) => {
      // make sure the id is in the checked list
      if (checkedList && checkedList.includes(e.id)) {
        return false;
      }
      return true;
    });
    // 2. update to local storage and set new state
    setExpensesList(newexpensesList);
    localStorage.setItem("expenses", JSON.stringify(newexpensesList));
  };

  const calculateTotal = () => {
    let total = 0;
    expensesList.forEach((e) => {
      total += parseInt(e.amount);
    });
    return total;
  };

  return (
    <div
      className="container mt-5 mx-auto"
      style={{
        maxWidth: "800px",
      }}
    >
      <Card>
        <Card.Body>
          <Card.Title>Expenses</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    disabled={
                      expensesList && expensesList.length > 0 ? false : true
                    }
                    onChange={(event) => {
                      checkBoxAll(event);
                    }}
                  />
                </th>
                <th>Source</th>
                <th>Amount</th>
                <th>
                  Actions
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    disabled={
                      checkedList && checkedList.length > 0 ? false : true
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      deleteCheckedItems();
                    }}
                  >
                    <BsTrash />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {expensesList.length > 0 ? (
                expensesList.map((e) => {
                  return (
                    <tr key={e.id}>
                      <td>
                        <Form.Check
                          checked={
                            checkedList && checkedList.includes(e.id)
                              ? true
                              : false
                          }
                          type="checkbox"
                          onChange={(event) => {
                            checkboxOne(event, e.id);
                          }}
                        />
                      </td>
                      <td>{e.name}</td>
                      <td>${e.amount}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(event) => {
                            event.preventDefault();
                            deleteExpenses(e.id);
                          }}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No expenses added yet.</td>
                </tr>
              )}
              <tr>
                <td>Total</td>
                <td>${calculateTotal()}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
          <Form>
            <Form.Group className="mb-1 mt-2">
              <Form.Control
                type="text"
                placeholder="Type your expenses here..."
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control
                type="number"
                placeholder="Type your amount here..."
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                addExpenses();
              }}
            >
              Add New
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Link to="/" className="pt-2 text-center">
        Go back to Dashboard
      </Link>
    </div>
  );
}
