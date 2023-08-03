import { RuleTester } from "@typescript-eslint/utils/ts-eslint";
import { it } from "vitest";
import rule, { RULE_NAME } from "./ensure-matching-remove-event-listener";

const valids = [
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          window.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
  `useEffect(() => {
        refcurrent = value;
      }, [value]);`,
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          window.document.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          document.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        domElement.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          domElement.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
];

const invalids = [
  {
    // window.document - required-cleanup
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // window.document - required-remove-eventListener
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          window.document.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThis();
          return () => {
            if (x) {
              doThisMore()
            }
            doThatAfter();
          };
        }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  {
    // document - required-cleanup
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          document.addEventListener("keydown", handleUserKeyPress);
          doOtherStuff();
        }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // document - required-remove-eventListener
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          document.addEventListener("keydown", handleUserKeyPress);
          doOtherStuff();
          return () => {
            if (x) {
              doThisMore()
            }
            doThatAfter();
          };
        }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  {
    // window - required-cleanup
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
      }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // window - required-remove-eventListener
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  {
    // content - required-cleanup
    code: `useEffect(() => {
        doMoreOfThis();
        const content = window;
        if (x) {
          doThisMore()
        }
        content.addEventListener("keydown", handleUserKeyPress);
        doSomeOtherStuff();
      }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // content - required-remove-eventListener
    code: `useEffect(() => {
        doMoreOfThis();
        const content = window;
        if (x) {
          doThisMore()
        }
        content.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        return () => {
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  // window.addEventListener X 2 - required-remove-eventListener
  {
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          window.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  // document.addEventListener X 2 - required-remove-eventListener
  {
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          document.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  // window.document.addEventListener X 2 - required-remove-eventListener
  {
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          window.document.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
] as const;

it("ensure-matching-remove-event-listener", () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids,
  });
});
