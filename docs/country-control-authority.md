# Country Checkout Control Authority

Country launch state is evaluated before payment-provider or tax logic.

A country that is not authorized for operation must fail closed before checkout, regardless of whether tax enforcement is enabled. Payment-provider eligibility and tax determination are downstream checks and cannot reactivate a disabled, private, or otherwise unauthorized market.
