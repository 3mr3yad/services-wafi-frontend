import type { AbstractIntlMessages } from 'next-intl';

/**
 * Selects the namespaces a client subtree needs, so only those strings ship to the browser.
 */
export function pickMessages(messages: AbstractIntlMessages, namespaces: readonly string[]): AbstractIntlMessages {
  const picked: AbstractIntlMessages = {};
  for (const namespace of namespaces) {
    const value = messages[namespace];
    if (value !== undefined) picked[namespace] = value;
  }
  return picked;
}
