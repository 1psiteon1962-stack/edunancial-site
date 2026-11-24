#!/bin/bash
bash /home/claude/l5work/tools/show1.sh "$@" | grep -v -e '^## Answer Key' -e '^## Answers and' -e '^## Learning Obj' -e '^## Core' -e '^## Practice' -e '^## Key Take' -e '^## Worked'
