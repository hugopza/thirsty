import assert from "node:assert/strict";
import test from "node:test";
import { isValidWhatsappUrl, selectBestGroup } from "./groups";

test("accepta només enllaços HTTPS oficials de WhatsApp", () => {
  assert.equal(isValidWhatsappUrl("https://chat.whatsapp.com/real-group"), true);
  assert.equal(isValidWhatsappUrl("https://wa.me/34600000000"), true);
  assert.equal(isValidWhatsappUrl("http://chat.whatsapp.com/insecure"), false);
  assert.equal(isValidWhatsappUrl("https://example.com/not-whatsapp"), false);
  assert.equal(isValidWhatsappUrl(null), false);
});

test("prioritza el grup de l'institut i conserva el grup general com a fallback", () => {
  const rows = [
    { institute_id: null, whatsapp_url: "https://chat.whatsapp.com/general" },
    { institute_id: 12, whatsapp_url: null },
  ];

  assert.equal(selectBestGroup(rows, 12)?.institute_id, 12);
  assert.equal(selectBestGroup(rows, 99)?.institute_id, null);
  assert.equal(selectBestGroup([], 12), null);
});
