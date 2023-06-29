# CloudDrive - cloud storage app

### Consistency problem and solution
The application's backend is entirely in the ``cloud``, with its many advantages, brings up the consistency problem due to the fluid performance that cloud platforms offer.
Each CRUD operation on the content in the app (files and folders), requires communication with two storages:
- DynamoDB - for metadata
- S3 - for storing the actual content

To make sure that the system is "never" permanently in an inconsistent state (``eventually consistent``), we applied the following tactics to all of our lambdas (single lambda handles each of the CRUD operations separately):
- DynamoDb communication is always before the S3 communication, as it is easier to ``rollback``
- Save the previous DynamoDB row state in a variable
- Apply the change (CRUD)
- If successful, apply the change to S3
- If S3 is also successful, return 200 OK - task end
- If S3 fails, rollback DynamoDB (by using the value saved in the first step) and return error message to user - task end

This way, the inconsistency between DynamoDB and S3 storages has been minimized.

For the scope and use case of our app, we find this solution to be satisfactory, though we also tried to achieve consistency with AWS StepFunctions, which we applied to "Family Registration" functionality and find to also be a suitable way to mitigate the inconsistency risk.
