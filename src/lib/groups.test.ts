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

test("prioritza institut, població i comarca per aquest ordre", () => {
  const rows = [
    {
      institute_id: null,
      location_id: null,
      whatsapp_url: "https://chat.whatsapp.com/comarca",
    },
    {
      institute_id: null,
      location_id: 5,
      whatsapp_url: "https://chat.whatsapp.com/poblacio",
    },
    { institute_id: 12, location_id: 5, whatsapp_url: null },
  ];

  assert.equal(selectBestGroup(rows, { instituteId: 12, locationId: 5 })?.institute_id, 12);
  assert.equal(selectBestGroup(rows, { locationId: 5 })?.location_id, 5);
  assert.equal(selectBestGroup(rows, { locationId: 99 })?.location_id, null);
  assert.equal(selectBestGroup([], { locationId: 5 }), null);
});
