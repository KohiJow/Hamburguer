import { Alert, AlertButton, AlertOptions } from "react-native";

import { confirmAction, showMessage } from "../dialog";

type AlertCall = [string, string | undefined, AlertButton[] | undefined, AlertOptions | undefined];

function lastAlertCall(spy: jest.SpyInstance): AlertCall {
  const call = spy.mock.calls[spy.mock.calls.length - 1] as AlertCall | undefined;

  if (!call) {
    throw new Error("Alert.alert nao foi chamado");
  }

  return call;
}

function pressButton(buttons: AlertButton[] | undefined, text: string) {
  const button = buttons?.find((item) => item.text === text);

  if (!button?.onPress) {
    throw new Error(`botao ${text} nao encontrado`);
  }

  button.onPress();
}

describe("showMessage", () => {
  it("abre um Alert com titulo e mensagem", () => {
    const spy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);

    showMessage("Atenção", "Mensagem");

    expect(spy).toHaveBeenCalledWith("Atenção", "Mensagem");
    spy.mockRestore();
  });
});

describe("confirmAction", () => {
  it("resolve true quando a pessoa confirma", async () => {
    const spy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);

    const promise = confirmAction("Remover", "Tem certeza?", "Remover");
    const [title, message, buttons] = lastAlertCall(spy);
    pressButton(buttons, "Remover");

    expect(title).toBe("Remover");
    expect(message).toBe("Tem certeza?");
    await expect(promise).resolves.toBe(true);
    spy.mockRestore();
  });

  it("resolve false quando cancela ou fecha o dialogo", async () => {
    const spy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);

    const cancelled = confirmAction("Remover", "Tem certeza?");
    pressButton(lastAlertCall(spy)[2], "Cancelar");
    await expect(cancelled).resolves.toBe(false);

    const dismissed = confirmAction("Remover", "Tem certeza?");
    const [, , , options] = lastAlertCall(spy);
    options?.onDismiss?.();
    await expect(dismissed).resolves.toBe(false);
    spy.mockRestore();
  });
});
