require 'json'
require 'mturk'

# Read from config file
file = File.read("config.json")
config = JSON.parse(file)["hitCreation"]

# For production:
# mturk = Amazon::WebServices::MechanicalTurkRequester.new :Host => :Production

# For testing:
mturk = Amazon::WebServices::MechanicalTurkRequester.new :Host => :Sandbox

QUALIFICATION_REQS = [
	{
		:QualificationTypeId => Amazon::WebServices::MechanicalTurkRequester::LOCALE_QUALIFICATION_TYPE_ID,
		:Comparator => 'EqualTo',
		:LocaleValue => {:Country => 'US'}
	},
	{
		:QualificationTypeId => Amazon::WebServices::MechanicalTurkRequester::TOTAL_NUMBER_OF_HITS_APPROVED_QUALIFICATION_TYPE_ID,
		:Comparator => 'GreaterThanOrEqualTo',
		:IntegerValue => 0
	},
	{
		:QualificationTypeId => Amazon::WebServices::MechanicalTurkRequester::APPROVAL_RATE_QUALIFICATION_TYPE_ID,
		:Comparator => 'GreaterThanOrEqualTo',
		:IntegerValue => 95
	}
]

for i in 1..config["numTasks"]
    questionText = "<ExternalQuestion xmlns=\"http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd\">\n"
    questionText += "<ExternalURL>" + config["taskUrl"]
    questionText += "</ExternalURL>\n  <FrameHeight>700</FrameHeight>\n</ExternalQuestion>"

    mturk.createHIT(
    	:Title => config["title"],
    	:Description => config["description"],
    	:MaxAssignments => config["numAssignments"],
    	:Reward => { :Amount => config["rewardAmount"], :CurrencyCode => "USD" },
    	:AssignmentDurationInSeconds => config["duration"],
    	:LifetimeInSeconds => config["lifetime"],
    	:Question => questionText,
    	:Keywords => config["keywords"],
    	:QualificationRequirement => QUALIFICATION_REQS
    )

    puts "Created task #{i}"
end
