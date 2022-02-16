const ENDPOINTS = {
    "pulls.listFiles":"pull-requests: read",
    "pulls.checkIfMerged": "pull-requests: read",
    "pulls.create": "pull-requests: write",
    'pulls.createReplyForReviewComment':'pull-requests: write', // TODO:verify the permission
    'pulls.createReview':'pull-requests: write', // TODO: verify the permission
    
    'pulls.deletePendingReview':'pull-requests: write',
    'pulls.deleteReviewComment':'pull-requests: write',
    'pulls.dismissReview':'pull-requests: write',

    'pulls.get':'pull-requests: read',
    'pulls.getReview':'pull-requests: read',
    'pulls.getReviewComment':'pull-requests: read',

    'pulls.list':'pull-requests: read',
    'pulls.listCommentsForReview':'pull-requests: read',
    'pulls.listCommits':'pull-requests: read',
    'pulls.listRequestedReviewers':'pull-requests: read',
    'pulls.listReviewComments':'pull-requests: read',
    'pulls.listReviewCommentsForRepo':'pull-requests: read',
    'pulls.listReviews':'pull-requests: read',

    'pulls.merge':'pull-requests: write',
    'pulls.removeRequestedReviewers':'pull-requests: write',
    'pulls.requestReviewers':'pull-requests: write',
    'pulls.submitReview':'pull-requests: write',
    
    'pulls.update':'pull-requests: write',
    'pulls.updateBranch':'pull-requests: write',
    'pulls.updateReview':'pull-requests: write',

}

const keys = Object.keys(ENDPOINTS)

export async function searchEndpoints(content: String){

    const output = {}
    for(let key of keys){
        if(content.indexOf(key) !== -1 ){
            output[key] = ENDPOINTS[key]
        }
    }
    return output
}