import excellence from "../../excellence";
import { defineFeature, loadFeature } from "jest-cucumber";

const feature = loadFeature("./src/__tests__/edd/excellence.feature.txt");

defineFeature(feature, (test) => {
  test("architecture must be excellent", ({ given, when, then }) => {
    given("solution aligns with excellent architecture", () => {});

    when("building solution", () => {});

    then("architecture is excellent", () => {});
  });

  test("nfrs must be met", ({ given, when, then }) => {
    given("solution meets non functional requirements", () => {});

    when("building solution", () => {});

    then("nfrs are met", () => {});
  });

  test("tech debt must be low", ({ given, when, then }) => {
    given("solution doesn't smell bad", () => {});

    when("building solution", () => {});

    then("tech debt is low", () => {});
  });
});
