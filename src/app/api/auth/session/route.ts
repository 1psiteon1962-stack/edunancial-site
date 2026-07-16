import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findMemberById } from "@/lib/auth/memberService";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/session
 *
 * Returns the current authenticated member's public profile from the session.
 * The client AuthProvider calls this on mount to restore UI state.
 * No passwords, hashes, or secrets are returned.
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.memberId) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Refresh member data from the database to ensure it's current
    const member = await findMemberById(session.memberId);

    if (!member || member.accountStatus === "deactivated") {
      // Session references a deleted/deactivated member — destroy it
      session.destroy();
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        country: member.country,
        phone: member.phone,
        biography: member.biography,
        preferredLanguage: member.preferredLanguage,
        preferredCurrency: member.preferredCurrency,
        role: member.role,
        membershipTier: member.membershipTier,
        membershipStatus: member.membershipStatus,
        emailVerified: member.emailVerified,
        accountStatus: member.accountStatus,
        joinedDate: member.joinedDate,
        lastLoginAt: member.lastLoginAt,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
