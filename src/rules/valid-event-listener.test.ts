import { describe, test } from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule, { RULE_NAME } from "./valid-event-listener";

const conditionalErrorMessage = "no-conditional-addeventlistener";
const cleanupErrorMessage = "required-cleanup";
const removeErrorMessage = "required-remove-eventListener";

const casesWithRequireUseEventListenerHookOption = {
  valids: [
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
      options: [{ requireUseEventListenerHook: false }],
    },
    {
      code: `useEffect(() => {
        refcurrent = value;
      }, [value]);`,
      options: [{ requireUseEventListenerHook: false }],
    },
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
      options: [{ requireUseEventListenerHook: false }],
    },
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
      options: [{ requireUseEventListenerHook: false }],
    },
    {
      code: `useEffect(() => {
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
      options: [{ requireUseEventListenerHook: false }],
    },
  ],
  invalids: [
    {
      // window.document - inline-if - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          if (x) window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // window.document - ternary - consequent - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          x && window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // window.document - ternary - alternate - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          x ? window.document.addEventListener("keydown", handleUserKeyPress) : x();
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // window.document - if - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          if (x) {
            window.document.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // window.document - else - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          if (x) {
            x()
          } else {
            window.document.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // window.document - && - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
            x && window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // window.document - required-cleanup
      code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: cleanupErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: removeErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: cleanupErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: removeErrorMessage,
        },
      ],
    },
    {
      // document - if - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          if (x) {
            document.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // document - && - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
            x && document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: cleanupErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: removeErrorMessage,
        },
      ],
    },
    {
      // window - if - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          if (x) {
            window.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // window - && - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
            x && window.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: cleanupErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: removeErrorMessage,
        },
      ],
    },
    {
      // content - if - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          const content = window;
          if (x) {
            content.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
        },
      ],
    },
    {
      // content - && - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
            x && content.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: conditionalErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: removeErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: removeErrorMessage,
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: removeErrorMessage,
        },
      ],
    },
  ] as const,
};

const casesWithoutOptions = {
  valids: [
    {
      code: `
      useEventListener('scroll', onScroll)
      useEventListener('visibilitychange', onVisibilityChange, documentRef)
      useEventListener('click', onClick, buttonRef)
      `,
    },
    {
      code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
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
    },
  ],
  invalids: [
    {
      code: `
      useEffect(() => {
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
      errors: [
        {
          messageId: "require-use-event-listener-hook",
        },
      ],
    },
  ] as const,
};

describe("valid-event-listener", () => {
  test("valid-event-listener - {requireUseEventListenerHook: false}", () => {
    const ruleTester: RuleTester = new RuleTester();

    ruleTester.run(RULE_NAME, rule, {
      valid: casesWithRequireUseEventListenerHookOption.valids,
      invalid: casesWithRequireUseEventListenerHookOption.invalids,
    });
  });

  test("valid-event-listener - {requireUseEventListenerHook: true}", () => {
    const ruleTester: RuleTester = new RuleTester();

    ruleTester.run(RULE_NAME, rule, {
      valid: casesWithoutOptions.valids,
      invalid: casesWithoutOptions.invalids,
    });
  });
});
