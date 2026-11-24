#!/bin/bash
# usage: hdr.sh C LOC  -> prints set of ## headers with counts; should show one count value per header
cat work/$1-L1-$2/b*.txt | grep "^## " | sort | uniq -c
