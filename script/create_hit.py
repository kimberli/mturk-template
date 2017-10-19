from boto3 import client
import json

with open('../config.json', 'r') as f:
    config = json.loads(f.read())['hitCreation']

if config['production']:
    endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'
else:
    endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'

cl = client('mturk', region_name='us-east-1', endpoint_url=endpoint_url)


def create_hit():
    quals = [
       {
           'QualificationTypeId': '00000000000000000071',
           'Comparator': 'EqualTo',
           'LocaleValues': [{
               'Country': 'US',
           }],
       },
       {
           'QualificationTypeId': '000000000000000000L0',
           'Comparator': 'GreaterThanOrEqualTo',
           'IntegerValues': [
               95
           ],
       },
    ]

    questionText = "<ExternalQuestion xmlns=\"http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/"
    questionText += "2006-07-14/ExternalQuestion.xsd\">\n<ExternalURL>" + config['taskUrl']
    questionText += "</ExternalURL>\n  <FrameHeight>700</FrameHeight>\n</ExternalQuestion>"

    cl.create_hit(
        MaxAssignments=config['numAssignments'],
        AutoApprovalDelayInSeconds=604800,
        LifetimeInSeconds=config['lifetime'],
        AssignmentDurationInSeconds=config['duration'],
        Reward=config['rewardAmount'],
        Title=config['title'],
        Keywords=config['keywords'],
        Description=config['description'],
        Question=questionText,
        QualificationRequirements=quals,
        )


for i in range(config['numTasks']):
    create_hit()
