// One Line to Your Younger Self
// make.fun bounty: u-boothlord-one-line-to-your-younger-self-22e97f76
//
// The program writes a single line to /output/entry.txt (or to
// $MAKEFUN_OUTPUT_DIR/entry.txt when that is set). The gate
// requires UTF-8 text of 1 to 200 characters, not only whitespace,
// a single line. The judge compares entries two at a time,
// weighing first that the line is actually told to a younger self,
// then that only this person's older self could say it, then that
// it lands in one breath in a real voice, then that it carries a
// turn, image or small surprise, then that it is honest and
// specific enough to sting a little. A slogan anyone could wear
// loses; a lived reversal wins.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MAX_CHARS = 200;
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Each candidate is scored on the judge's own criteria, most
// important first. Scores are small integers so the ranking is
// transparent and the pick is deterministic: ties break toward
// the earlier candidate, never by chance.
interface Candidate {
  line: string;
  toldToYoungerSelf: number; // actually addressed to a younger self, not a slogan
  onlyOlderSelf: number; // drawn from a life actually lived, not a motto anyone could wear
  oneBreath: number; // lands in one breath, real voice, no explaining
  turn: number; // a turn, image or small surprise that stays after one reading
  sting: number; // honest and specific enough to sting a little
}

const CANDIDATES: Candidate[] = [
  {
    // The reversal is the whole line: the job you bet your life
    // on nearly breaks you, and the silly Sunday hobby you dismiss
    // saves you. A lived contradiction, told straight to the kid,
    // with the sting in the second half and the turn on the dash.
    line: "The job you think will save you will nearly break you — and the silly thing you do on Sundays is what saves you instead.",
    toldToYoungerSelf: 5,
    onlyOlderSelf: 5,
    oneBreath: 5,
    turn: 5,
    sting: 4,
  },
  {
    // Concrete and honest — borrowed money, five years of payback
    // — but "impress people who don't like you" is a familiar
    // shape every advice column wears, so it scores low on
    // only-older-self despite the sting.
    line: "The money you are about to borrow to impress people who don't like you will take five years to pay back — walk away now, kid.",
    toldToYoungerSelf: 5,
    onlyOlderSelf: 2,
    oneBreath: 4,
    turn: 3,
    sting: 5,
  },
  {
    // Warm and true, but it explains itself ("were the whole
    // point"), the image is soft, and the shape is familiar —
    // every letter to a younger self says some version of this.
    line: "You will spend years chasing the people who left; the ones who stayed were the whole point, and you almost missed them.",
    toldToYoungerSelf: 5,
    onlyOlderSelf: 3,
    oneBreath: 4,
    turn: 2,
    sting: 3,
  },
  {
    // A door of your own is a nice image, but "stop waiting to be
    // picked" is a slogan shape anyone could wear, and the line
    // runs long without earning its length.
    line: "Stop waiting to be picked, kid — the room you keep knocking on was never yours, and the one you build yourself has your name on the door.",
    toldToYoungerSelf: 5,
    onlyOlderSelf: 3,
    oneBreath: 3,
    turn: 4,
    sting: 3,
  },
  {
    // The rain and the thank-you give it warmth, but "teach you
    // more about leaving than any book" is a line any heartbreak
    // song could sing; too generic to be only this older self.
    line: "That girl who broke your heart in the rain will teach you more about leaving than any book ever will — thank her, then go.",
    toldToYoungerSelf: 5,
    onlyOlderSelf: 2,
    oneBreath: 4,
    turn: 3,
    sting: 3,
  },
];

// Weight the criteria the way the judge brief orders them:
// told-to-younger-self first, then only-older-self, then
// one-breath, then turn, then sting. A candidate that is not one
// line, or that breaks the 200-character cap, is disqualified
// from the pick outright instead of merely losing points: the
// gate would refuse it, so no score can save it.
function isEligible(c: Candidate): boolean {
  return (
    c.line.length >= 1 &&
    c.line.length <= MAX_CHARS &&
    c.line.trim().length > 0 &&
    !c.line.includes("\n") &&
    !c.line.includes("\r")
  );
}

function score(c: Candidate): number {
  return (
    c.toldToYoungerSelf * 5 +
    c.onlyOlderSelf * 4 +
    c.oneBreath * 3 +
    c.turn * 2 +
    c.sting * 1
  );
}

function pickBest(candidates: Candidate[]): string {
  const eligible = candidates.filter(isEligible);
  if (eligible.length === 0) {
    throw new Error("no candidate passes the gate");
  }
  let best = eligible[0];
  let bestScore = score(best);
  for (const c of eligible.slice(1)) {
    const s = score(c);
    if (s > bestScore) {
      best = c;
      bestScore = s;
    }
  }
  return best.line;
}

const LINE = pickBest(CANDIDATES);

// The gate the sealed scorer applies: UTF-8 text of 1 to 200
// characters, not only whitespace, a single line. Check the text
// before writing it, then read the file back and check what landed.
function assertGateOk(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`line is ${text.length} chars, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line must be a single line");
  }
}

assertGateOk(LINE);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/entry.txt`, LINE, "utf8");

const written = readFileSync(`${OUT_DIR}/entry.txt`, "utf8");
assertGateOk(written);
if (written !== LINE) {
  throw new Error("entry.txt does not match the line");
}
console.log(`wrote ${written.length} chars to ${OUT_DIR}/entry.txt`);
console.log(written);
