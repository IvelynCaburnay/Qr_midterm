export type QRPayload = {
  v: 1;
  event: string;
  title?: string;
  start?: string;
  end?: string;
};

export function buildQRPayload(event: {
  eventId: string;
  title?: string;
  start?: string;
  end?: string;
}): string {
  return JSON.stringify({
    v: 1,
    event: event.eventId,
    ...(event.title ? { title: event.title } : {}),
    ...(event.start ? { start: event.start } : {}),
    ...(event.end ? { end: event.end } : {}),
  });
}

export type ParseQRResult =
  | {
      ok: true;
      payload: QRPayload;
    }
  | {
      ok: false;
      message: string;
    };

export function parseQRPayload(
  raw: string
): ParseQRResult {
  try {
    const payload = JSON.parse(raw) as QRPayload;

    if (
      payload.v !== 1 ||
      typeof payload.event !== 'string' ||
      !payload.event.trim()
    ) {
      return {
        ok: false,
        message: 'Not an attendance QR code.',
      };
    }

    return {
      ok: true,
      payload,
    };
  } catch {
    return {
      ok: false,
      message: 'Invalid QR code.',
    };
  }
}
