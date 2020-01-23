import { TClientID } from "./utils";

export type TRow = {
  id: TClientID;
  speed: number;
  isStalled: boolean;
};

export default function(rows: TRow[]) {
  let ret = "<html><table>\n";

  ret += `
    <thead>
        <tr>
            <td>ID</td>
            <td>Speed (kmph)</td>
            <td>Stalled</td>
        </tr>
    </thead>`;

  for (const row of rows) {
    const style = row.isStalled
      ? `class="stalled-${row.id}" style="background: yellow;"`
      : "";

    ret += `
    <tr ${style}>
        <td>${row.id}</td>
        <td>${row.speed}</td>
        <td>${row.isStalled ? "YES" : "NO"}</td>
    </tr>s `;
  }

  return ret + "\n</table></html>";
}
