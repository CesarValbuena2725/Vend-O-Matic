const request = require("supertest");
const app = require("../app")

describe("Vend-O-Matic API", () => {
  let agent;

  beforeEach(() => {
    agent = request.agent(app);
  });

  test("GET /inventory should return initial inventory", async () => {
    const res = await agent.get("/inventory");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([5, 5, 5]);
  });

  test("PUT / should insert a coin and increase X-Coins header", async () => {
    const res1 = await agent
      .put("/")
      .send({ coin: 1 })
      .set("Content-Type", "application/json");
    expect(res1.status).toBe(204);
    expect(res1.headers["x-coins"]).toBe("1");

    const res2 = await agent
      .put("/")
      .send({ coin: 1 })
      .set("Content-Type", "application/json");
    expect(res2.headers["x-coins"]).toBe("2");
  });

  test("PUT /inventory/:id should purchase item with enough coins", async () => {
    // insert 2 coins first
    await agent.put("/").send({ coin: 1 });
    await agent.put("/").send({ coin: 1 });

    const res = await agent.put("/inventory/0");
    expect(res.status).toBe(200);
    expect(res.headers["x-coins"]).toBe("0"); // coins reset
    expect(res.headers["x-inventory-remaining"]).toBe("4"); // inventory decreased
    expect(res.body).toEqual({ quantity: 1 });
  });

  test("PUT /inventory/:id should fail if not enough coins", async () => {
    //no coins inserted
    const res = await agent.put("/inventory/1");
    expect(res.status).toBe(403);
    expect(res.headers["x-coins"]).toBe("0");
  });

  test("PUT /inventory/:id should fail if out of stock", async () => {
    // deplete item 2
    const tempAgent = request.agent(app);
    for (let i = 0; i < 5; i++) {
      await tempAgent.put("/").send({ coin: 1 });
      await tempAgent.put("/").send({ coin: 1 })
      await tempAgent.put("/inventory/2");
    }

    // try to buy again
    await tempAgent.put("/").send({ coin: 1 });
    await tempAgent.put("/").send({ coin: 1 });
    const res = await tempAgent.put("/inventory/2");

    expect(res.status).toBe(404);
    expect(res.headers["x-coins"]).toBe("2"); // coins remain
  });

  test("DELETE / should return coins and reset session", async () => {
    await agent.put("/").send({ coin: 1 });
    await agent.put("/").send({ coin: 1 });

    const res = await agent.delete("/");
    expect(res.status).toBe(204);
    expect(res.headers["x-coins"]).toBe("2");

    // check coins reset
    const res2 = await agent.put("/inventory/0");
    expect(res2.status).toBe(403); // not enough coins
  });

  test("PUT / with invalid coin should return 400", async () => {
    const res = await agent
      .put("/")
      .send({ coin: 5 })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Only quarters are accepted");
  });

  test("PUT / without coin value should return 400", async () => {
    const res = await agent
      .put("/")
      .send({})
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Coin value required");
  });

  test("PUT /inventory/:id with invalid id should return 404", async () => {
    const res = await agent.put("/inventory/100");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Invalid item ID");
  });
});