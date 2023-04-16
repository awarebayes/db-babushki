import express from "express";

export const serviceController = {
  test: (req: express.Request, res: express.Response) => {
    res.status(200).send("Order service!");
  },
};
