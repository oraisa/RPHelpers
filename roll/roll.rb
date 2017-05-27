#!/usr/bin/ruby

def roll(diceNum, diceType, modifier)
    results = []
    diceNum.times do |i|
        results.push((Random.rand(0..1.0) * diceType).floor + 1)
    end

    resultString = results.reduce("") { |s, n| s + n.to_s() + " + " }
    resultString.chomp!(" + ")
    if modifier > 0 then
        #Remove trailing + and don't display the modifier if it is 0
        resultString += " + " + modifier.to_s
    elsif modifier < 0 then
        resultString += " - " + (-modifier).to_s
    end

    #Don't include the "= sum" part if only one dice is rolled and there isn't
    #a modifier
    if diceNum == 1 and modifier == 0 then
        return resultString
    else
        return resultString + " = " + (results.reduce(0, :+) + modifier).to_s
    end
end

# match = /(\d*)d(\d+)(?:\+(\d+))?/.match(ARGV[0])
match = /(\d*)d(\d+)([\+\-]\d+)?/.match(ARGV[0])
if(match) then
    diceNum = match[1].to_i
    diceType = match[2].to_i
    mod = match[3].to_i
    puts roll(if diceNum != 0 then diceNum else 1 end, diceType, if mod then mod else 0 end)
else
    puts "The format is n_1dn_2+n_3"
end
