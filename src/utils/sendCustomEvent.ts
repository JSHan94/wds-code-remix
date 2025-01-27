/**
 * send custom events to Google Analytics
 */

type CustomEvent = 'deploy' | 'compile' | 'create_template' | 'new_project' | 'at_address' | 'test';
type EventCategory = 'initia';

interface EventOptions {
  event_category: EventCategory;
  method: CustomEvent;
  event_label?: string;
  value?: string;
}

export const sendCustomEvent = (customEvent: CustomEvent, eventOptions?: EventOptions) => {
  const { gtag, dataLayer } = window;

  dataLayer?.push({
    event: customEvent,
    ...eventOptions,
  });
  gtag('event', 'click', eventOptions);
};
