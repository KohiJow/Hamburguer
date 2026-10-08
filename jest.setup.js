// O AsyncStorage real precisa do modulo nativo; nos testes usa o mock em memoria
// que o proprio pacote publica.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
