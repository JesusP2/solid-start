// @ts-ignore
import type { Component } from "solid-js";
import { NoHydration, getRequestEvent, ssr } from "solid-js/web";
import { renderAsset } from "../renderAsset";
import type { DocumentComponentProps, PageEvent } from "../types";

const docType = ssr("<!DOCTYPE html>");

export function StartServer(props: { document: Component<DocumentComponentProps> }) {
  const context = getRequestEvent() as PageEvent;
  return (
    <NoHydration>
      {docType as unknown as any}
      <props.document
        assets={
          <>
            {context.assets.map((m: any) => renderAsset(m))}
          </>
        }
        scripts={
          <>
            <script innerHTML={`window.manifest = ${JSON.stringify(context.manifest)}`} />
            <script
              type="module"
              src={
                import.meta.env.MANIFEST["client"]!.inputs[
                  import.meta.env.MANIFEST["client"]!.handler
                ]!.output.path
              }
            />
          </>
        }
      ></props.document>
    </NoHydration>
  );
}
