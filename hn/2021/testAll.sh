#!/bin/sh
node hn.js a.txt &
a=$!
node hn.js b.txt &
b=$!
node hn.js c.txt &
c=$!
node hn.js d.txt &
d=$!
node hn.js e.txt &
e=$!
node hn.js f.txt &
f=$!

wait $a
wait $b
wait $c
wait $d
wait $e
wait $f