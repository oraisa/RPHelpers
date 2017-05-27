#!/usr/bin/ruby

cases = Hash[
    "d6" => /\d/,
    "d6+2" => /\d \+ 2 = \d/,
    "1d6" => /\d/,
    "2d6" => /\d \+ \d = \d+/,
    "3d6" => /\d \+ \d \+ \d = \d+/,
    "3d6+4" => /\d \+ \d \+ \d \+ 4 = \d+/,
    "3d6-2" => /\d \+ \d \+ \d \- 2 = \-?\d+/,
    "d4" => /\d/,
    "d4-6" => /\d \- 6 = \-\d/,
    "d8" => /\d/,
    "d10" => /\d+/,
    "d12" => /\d+/
]

cases.each do |call, regexp|
    output = `./roll.rb #{call}`
    match = regexp.match(output)
    if match then
        puts "Pass"
    else
        puts "Fail: expected #{regexp}, got #{output}"
    end
end
