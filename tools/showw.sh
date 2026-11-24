#!/bin/bash
# compact English view for short-format L1: showw.sh COLOR FROM TO
bash /home/claude/l5work/tools/show1.sh "$@" | grep -v -e '^## Answer Key' -e '^## Answers and' -e '^## Learning Obj' -e '^By the end' -e '^## Core' -e '^## Practice' -e '^## Key Take' -e '^## Worked' -e '^### Question' -e '^[0-9]\. [A-D]$' -e '^[0-9]\. True$' -e '^[0-9]\. False$'
