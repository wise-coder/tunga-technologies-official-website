// Accept one mailbox, never a display name or a list of recipients.
export function isEmailAddress(value: string) {
  return (
    value.length <= 200 &&
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(
      value,
    )
  );
}
