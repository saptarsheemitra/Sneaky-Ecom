import React, { useState, useEffect } from "react";
import axios from "axios";
import "./mostBought.css";
import Product from "../Products/Product";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
const windowCheck = window.screen.width;
const MostBought = ({ state }) => {
  const [data, setData] = useState([]);
  const [most, setMost] = useState([]);
  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get("https://lit-thicket-99427.herokuapp.com/api/user/toporders", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((data) => setData(data.data));
    };
    fetchOrders();
  }, [state]);

  useEffect(() => {
    function getOccurrence(array, value) {
      var count = 0;
      array.forEach((v) => v === value && count++);
      return count;
    }
    const emptyArr = [];
    const copy = [...data];
    const returnCart = copy.map((el) => el.cartMongo);
    const returnAgain = returnCart.map((el) => el);
    const copyTwo = [...returnAgain];
    const reCopy = copyTwo.map((el) => el.map((z) => z.id));
    reCopy.map((el) => el.map((z) => emptyArr.push(z)));
    const result = emptyArr.map((el) => {
      let newZ = {
        id: state.filter((z) => z.id === el),
        orderTimes: getOccurrence(emptyArr, el),
      };
      return newZ;
    }); // Gets form state.produc titem filters it and then makes new object with the amount of orders

    const removeDUplicate = result
      .filter(
        (thing, index, self) =>
          index === self.findIndex((t) => t.id[0] === thing.id[0]) //Compares them if there are dublicate values
      )
      .sort((a, b) => {
        return a.orderTimes - b.orderTimes;
      })
      .reverse(); //Makes order by NUmbers sold
    setMost(removeDUplicate);
  }, [data, state]);

  if (!most.length) {
    return (
      <h1>
        <CircularProgress color="secondary" style={{ color: "orange" }} />
      </h1>
    );
  }
  return (
    <div className="container">
      <div className="head"><h3>Most Sold shoes</h3></div>
      <div className="cardsContainer">
        {most.slice(0, 5).map((el, index) => {
          if (el.id[0]) {
            return <Product key={index} product={el.id[0]} />;
          } else {
            return <p key={index}>Loading....</p>;
          }
        })}
      </div>
    </div>
  );
};

export default MostBought;
