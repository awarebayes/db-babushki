import { repositories } from "../../../data/impl_integration";
import { createGrandma } from "../grandmas";
import { createNewMealForGrandma } from "../meals";
import { placeOrder } from "../orders";
import { signUp, SignIn } from "../users";
import { create_dummy_user } from "../is_utils";

describe("is user tests", () => {
  jest.setTimeout(60000);

  it("user should sign up and log in successfully", async () => {
    let user = await signUp(repositories, {
      name: "JehnDosdasdsadsadsadasde",
      password: "jdoe1234",
      password_verification: "jdoe1234",
      username: "aboba",
      email: "asdsadsdadasd@gmail.com",
    });

    expect(user).toBeTruthy();
    expect(user?.username).toBe("aboba");

    expect(
      SignIn(repositories, {
        username: "aboba",
        password: "jdoe1234",
      })
    ).resolves.toBeTruthy();

    let grandma = await createGrandma(repositories, {
      username: "aboba",
      is_admin: false,
    });

    expect(grandma).toBeTruthy();

    let meal = await createNewMealForGrandma(repositories, {
      grandma: {
        connect: {
          username: "aboba",
        },
      },
      name: "Belyashi",
      cookedBy: "aboba",
      cookedByName: "JehnDoe",
      price: 123,
      pictureUrl: "None",
      rating: 1,
      description: "Idk",
    });
    expect(meal).toBeTruthy();

    let zoomer = await create_dummy_user(repositories)!;

    let order = await placeOrder(
      repositories,
      {
        username: zoomer.username,
        is_admin: false,
      },
      [
        {
          count: 1,
          mealId: meal!.id,
        },
      ]
    );

    expect(order).toBeTruthy();

    let orders_expanded = await repositories.orderRepository.getOrdersOfUser(
      zoomer!.id
    );
    for (let order of orders_expanded) {
      for (let item of order.items) {
        await repositories.orderItemsRepository.delete(item.id);
      }
      repositories.orderRepository.delete(order.id);
    }

    await repositories.mealRepository.delete(meal!.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user!.id);
    await repositories.userRepository.delete(zoomer!.id);
  });
});
