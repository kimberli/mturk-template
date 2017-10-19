import boto3
import json
import sys
from datetime import datetime

SANDBOX_ENDPOINT = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'

#production
real_mturk = boto3.client('mturk')

#testing
test_mturk = boto3.client('mturk', endpoint_url = SANDBOX_ENDPOINT)

def make_hit(config):
    mturk = test_mturk if config["useSandbox"] else real_mturk

    #These codes were found at http://docs.aws.amazon.com/AWSMechTurk/latest/AWSMturkAPI/ApiReference_QualificationRequirementDataStructureArticle.html#ApiReference_QualificationType-IDs
    LOCALE_QUALIFICATION_TYPE_ID = "00000000000000000071"
    TOTAL_NUMBER_HITS_APPROVED_QUALIFICATION_TYPE_ID = "00000000000000000040"
    APPROVAL_RATE_QUALIFICATION_TYPE_ID = "000000000000000000L0"

    QUALIFICATIONS = [
        {
            "QualificationTypeId": LOCALE_QUALIFICATION_TYPE_ID,
            "Comparator": "EqualTo",
            "LocaleValues": [{"Country": "US"}],
        }, {
            "QualificationTypeId": TOTAL_NUMBER_HITS_APPROVED_QUALIFICATION_TYPE_ID,
            "Comparator": "GreaterThanOrEqualTo",
            "IntegerValues": [0]
        }, {
            "QualificationTypeId": APPROVAL_RATE_QUALIFICATION_TYPE_ID,
            "Comparator": "GreaterThanOrEqualTo",
            "IntegerValues": [95]
        },
    ]

    hit_data = config["hitCreation"]
    questionXML = '<ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">\n    <ExternalURL>%s</ExternalURL>\n    <FrameHeight>700</FrameHeight>\n</ExternalQuestion>' % hit_data["taskUrl"]
    task = mturk.create_hit(
            MaxAssignments=config["numAssignments"],
            LifetimeInSeconds=config["lifetime"],
            AssignmentDurationInSeconds=config["duration"],
            Reward=config["rewardAmount"],
            Title=config["title"],
            Keywords=config["keywords"],
            Description=config["description"],
            QualificationRequirements=QUALIFICATIONS,
            Question=questionXML
    )

    print("Task created", task)

with open('../config.json') as infile: 
    config = json.load(infile)

num_tasks = config["hitCreation"]["numTasks"]

for i in range(num_tasks): 
    make_hit(config)

print(num_tasks, "hits succesfully created")

