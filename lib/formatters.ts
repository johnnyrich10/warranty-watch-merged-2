export function formatClaim(claim: any) {
  return {
    id: claim.id,
    claimNumber: claim.claimNumber,
    category: claim.category,
    description: claim.description,
    priority: claim.priority,
    status: claim.status,
    preferredAccess: claim.preferredAccess,
    closeDate: claim.home?.closeDate ? new Date(claim.home.closeDate).toLocaleDateString() : null,
    homeownerName: claim.home?.homeowner?.name ?? 'Unknown homeowner',
    address: claim.home?.address ?? 'Unknown address',
    communityName: claim.home?.community?.name ?? 'Unknown community',
    vendorName: claim.vendor?.name ?? null,
  };
}
