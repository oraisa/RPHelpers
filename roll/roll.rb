#!/usr/bin/ruby

def roll(diceNum, diceType, modifier)
    results = []
    diceNum.times do |i|
        results.push((Random.rand(0..1.0) * diceType).floor + 1)
    end

    resultString = results.reduce("") { |s, n| s + n.to_s() + " + " }
    if modifier == 0 then
        #Remove trailing + and don't display the modifier it is 0
        resultString.chomp!(" + ")
    else
        resultString += modifier.to_s
    end

    #Don't include the "= sum" part if only one dice is rolled and there isn't
    #a modifier
    if diceNum == 1 and modifier == 0 then
        return resultString
    else
        return resultString + " = " + (results.reduce(0, :+) + modifier).to_s
    end
end

match = /(\d+)d(\d+)(?:\+(\d+))?/.match(ARGV[0])
if(match) then
    puts roll(match[1].to_i, match[2].to_i, if match[3] then match[3].to_i else 0 end)
else
    puts "The format is n1dn2+n3"
end
