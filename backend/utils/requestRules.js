// Business rules for contact requests, kept separate from the routes so they are easy to test.

export const REVEAL_STATUSES = ["accepted", "completed"];
const VALID_STATUSES = ["accepted", "declined", "completed"];

const same = (a, b) => String(a) === String(b);

// Can `userId` move `request` to `status`?
//   pending  -> accepted / declined : donor only
//   accepted -> completed           : donor or requester
export function checkTransition(request, userId, status) {
  if (!VALID_STATUSES.includes(status)) {
    return { ok: false, code: 400, message: "Invalid status" };
  }

  const isDonor = same(request.donor, userId);
  const isRequester = same(request.requester, userId);
  if (!isDonor && !isRequester) {
    return { ok: false, code: 403, message: "This is not your request" };
  }

  if (status === "completed") {
    if (request.status !== "accepted") {
      return { ok: false, code: 400, message: "Only an accepted request can be marked completed" };
    }
    return { ok: true };
  }

  if (!isDonor) {
    return { ok: false, code: 403, message: "Only the donor can accept or decline a request" };
  }
  if (request.status !== "pending") {
    return { ok: false, code: 400, message: `This request is already ${request.status}` };
  }
  return { ok: true };
}

// What one participant is allowed to see about a request.
// The other person's email/phone is included ONLY once the donor has accepted.
export function shapeForUser(r, userId) {
  if (!r.requester || !r.donor) return null; // one of the accounts was deleted

  const iAmDonor = same(r.donor._id, userId);
  const other = iAmDonor ? r.requester : r.donor;
  const canSeeContact = REVEAL_STATUSES.includes(r.status);

  return {
    _id: r._id,
    status: r.status,
    message: r.message,
    createdAt: r.createdAt,
    role: iAmDonor ? "donor" : "requester",
    requester: { _id: r.requester._id, name: r.requester.name },
    donor: { _id: r.donor._id, name: r.donor.name, bloodType: r.donor.bloodType },
    contact: canSeeContact
      ? { name: other.name, email: other.email, phone: other.phone || null }
      : null
  };
}