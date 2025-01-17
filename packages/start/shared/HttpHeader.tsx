import { onCleanup } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import type { PageEvent } from "../server/types";

export function HttpHeader(props: { name: string; value: string; append?: boolean }) {
  if (isServer) {
    const event = getRequestEvent() as PageEvent;

    if (props.append) event.response.headers.append(props.name, props.value);
    else event.response.headers.set(props.name, props.value);

    onCleanup(() => {
      if (event.nativeEvent.handled) return;
      const value = event.response.headers.get(props.name);
      if (!value) return;
      if (!value.includes(", ")) {
        if (value === props.value) event.response.headers.delete(props.name);
        return;
      }
      const values = value.split(", ");
      const index = values.indexOf(props.value);
      index !== -1 && values.splice(index, 1);
      if (values.length) event.response.headers.set(props.name, values.join(","));
      else event.response.headers.delete(props.name);
    });
  }

  return null;
}
